import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class SendEmailService {
  private readonly logger = new Logger(SendEmailService.name);
  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }

  async sendVerificationCode(email: string, verificationCode: string) {
    const mail: SendGrid.MailDataRequired = {
      to: email,
      from: {
        name: '쿡로그',
        email: this.configService.get<string>('SEND_EMAIL_ADDRESS'),
      },
      templateId: this.configService.get<string>('SENDGRID_TEMPLATE_ID'),
      dynamicTemplateData: { verificationCode },
    };
    try {
      await SendGrid.send(mail);
      this.logger.log(`$Email sent successfullt to ${email}`);
    } catch (error) {
      this.logger.error('Fail to send email :', error);
    }
  }
}
