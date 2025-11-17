import { Controller, Post, Body, Query, BadRequestException } from '@nestjs/common';
import { SubmitTestimonialDto } from 'src/modules/testimonial/dto/submit-testimonial.dto';

@Controller('public/testimonials')
export class PublicTestimonialController {
  // This is a placeholder - you'll need to inject the proper Twenty services
  // and follow Twenty's workspace/data source patterns

  @Post('submit')
  async submitTestimonial(
    @Body() dto: SubmitTestimonialDto,
    @Query('workspaceId') workspaceId: string,
  ) {
    if (!workspaceId) {
      throw new BadRequestException('workspaceId is required');
    }

    // TODO: Implement using Twenty's TwentyORMManager
    // 1. Get workspace data source
    // 2. Create testimonial record with status 'PENDING'
    // 3. Create testimonial target if companyId/personId/opportunityId provided
    // 4. Optional: Send notification email to workspace admins

    return {
      success: true,
      message: 'Testimonial submitted successfully and pending approval',
    };
  }
}
