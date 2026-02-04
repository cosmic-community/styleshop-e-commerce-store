'use server'

import { Resend } from 'resend'
import { ContactFormData, ContactFormResponse } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(formData: ContactFormData): Promise<ContactFormResponse> {
  const { name, email, message } = formData

  // Validate form data
  if (!name || !email || !message) {
    return {
      success: false,
      message: 'Please fill in all fields'
    }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: 'Please enter a valid email address'
    }
  }

  try {
    await resend.emails.send({
      from: 'my@email.com',
      to: 'my@email.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a2e; border-bottom: 2px solid #e94560; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="padding: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>Message:</strong></p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin-top: 10px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">
            This email was sent from the StyleShop contact form.
          </p>
        </div>
      `
    })

    return {
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.'
    }
  } catch (error) {
    console.error('Failed to send email:', error)
    return {
      success: false,
      message: 'Failed to send message. Please try again later.'
    }
  }
}