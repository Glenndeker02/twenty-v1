import { Module } from '@nestjs/common';
import { PublicTestimonialController } from 'src/modules/testimonial/controllers/public-testimonial.controller';

@Module({
  controllers: [PublicTestimonialController],
  providers: [],
  exports: [],
})
export class TestimonialModule {}
