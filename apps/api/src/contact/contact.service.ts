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
    const to =
      process.env.CONTACT_TO_EMAIL ||
      process.env.SMTP_USER ||
      process.env.RESEND_TO;
    if (!to) {
      throw new ServiceUnavailableException(
        '수신 메일(CONTACT_TO_EMAIL)이 설정되지 않았습니다.',
      );
    }

    const subject = `[포트폴리오 문의] ${input.name}`;
    const text = [
      `포트폴리오 문의 #${input.id}`,
      '',
      `이름: ${input.name}`,
      `회신 이메일: ${input.email}`,
      '',
      input.message,
    ].join('\n');

    // Render 등 PaaS에서는 Gmail SMTP(465/587)가 응답 없이 멈추는 경우가 많아
    // HTTP API(Resend)를 우선 사용한다.
    if (process.env.RESEND_API_KEY) {
      await this.sendViaResend({ to, subject, text, replyTo: input.email });
      return;
    }

    await this.sendViaSmtp({ to, subject, text, replyTo: input.email });
  }

  private async sendViaResend(input: {
    to: string;
    subject: string;
    text: string;
    replyTo: string;
  }) {
    const from =
      process.env.RESEND_FROM ||
      process.env.SMTP_FROM ||
      'Portfolio <onboarding@resend.dev>';

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [input.to],
          reply_to: input.replyTo,
          subject: input.subject,
          text: input.text,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const body = await response.text().catch(() => '');
        this.logger.error(`Resend failed (${response.status}): ${body}`);
        throw new ServiceUnavailableException(
          '메일 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.',
        );
      }
    } catch (error) {
      if (error instanceof ServiceUnavailableException) throw error;
      this.logger.error(`Resend error: ${String(error)}`);
      throw new ServiceUnavailableException(
        '메일 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.',
      );
    } finally {
      clearTimeout(timer);
    }
  }

  private async sendViaSmtp(input: {
    to: string;
    subject: string;
    text: string;
    replyTo: string;
  }) {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      this.logger.error(
        'Mail env missing. Set RESEND_API_KEY (recommended on Render) or SMTP_HOST/USER/PASS.',
      );
      throw new ServiceUnavailableException(
        '메일 전송 설정이 되어 있지 않습니다. 잠시 후 다시 시도해 주세요.',
      );
    }

    const port = Number(process.env.SMTP_PORT || 587);
    const secure =
      process.env.SMTP_SECURE === 'true' ||
      process.env.SMTP_SECURE === '1' ||
      port === 465;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      // Render에서 SMTP가 무한 대기로 멈추지 않도록 짧게 끊는다
      connectionTimeout: 12_000,
      greetingTimeout: 12_000,
      socketTimeout: 12_000,
    });

    const from = process.env.SMTP_FROM || user;

    try {
      await transporter.sendMail({
        from,
        to: input.to,
        replyTo: input.replyTo,
        subject: input.subject,
        text: input.text,
      });
    } catch (error) {
      this.logger.error(`SMTP send failed: ${String(error)}`);
      throw new ServiceUnavailableException(
        '메일 전송에 실패했습니다. Render에서는 Resend(RESEND_API_KEY) 사용을 권장합니다.',
      );
    }
  }
}
