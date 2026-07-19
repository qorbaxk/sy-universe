import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as nodemailer from 'nodemailer';
import { Repository } from 'typeorm';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactMessageEntity } from './entities/contact-message.entity';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @InjectRepository(ContactMessageEntity)
    private readonly contactRepo: Repository<ContactMessageEntity>,
  ) {}

  async create(dto: CreateContactDto, ip?: string) {
    const name = dto.name.trim();
    const email = dto.email.trim().toLowerCase();
    const message = dto.message.trim();

    const saved = await this.contactRepo.save({
      name,
      email,
      message,
      ip,
    });

    await this.sendInquiryMail({ name, email, message, id: saved.id });

    this.logger.log(`Contact #${saved.id} mailed from ${email} (${name})`);

    return {
      id: saved.id,
      ok: true,
      message: '문의가 전달됐어요. 확인 후 메일로 회신할게요.',
    };
  }

  private async sendInquiryMail(input: {
    id: number;
    name: string;
    email: string;
    message: string;
  }) {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.CONTACT_TO_EMAIL || user;

    if (!host || !user || !pass || !to) {
      this.logger.error(
        'SMTP env missing (SMTP_HOST / SMTP_USER / SMTP_PASS / CONTACT_TO_EMAIL)',
      );
      throw new ServiceUnavailableException(
        '메일 전송 설정이 되어 있지 않습니다. 잠시 후 다시 시도해 주세요.',
      );
    }

    const port = Number(process.env.SMTP_PORT || 465);
    const secure =
      process.env.SMTP_SECURE === 'true' ||
      process.env.SMTP_SECURE === '1' ||
      port === 465;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    const from = process.env.SMTP_FROM || user;
    const text = [
      `포트폴리오 문의 #${input.id}`,
      '',
      `이름: ${input.name}`,
      `회신 이메일: ${input.email}`,
      '',
      input.message,
    ].join('\n');

    try {
      await transporter.sendMail({
        from,
        to,
        replyTo: input.email,
        subject: `[포트폴리오 문의] ${input.name}`,
        text,
      });
    } catch (error) {
      this.logger.error(`SMTP send failed: ${String(error)}`);
      throw new ServiceUnavailableException(
        '메일 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.',
      );
    }
  }
}
