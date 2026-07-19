import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ContactMessageEntity } from './entities/contact-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContactMessageEntity])],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
