import { IsString, IsNotEmpty, IsNumber, Min, Max, IsOptional, IsUrl } from 'class-validator';

export class SubmitTestimonialDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsOptional()
  customerRole?: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @IsString()
  @IsOptional()
  personId?: string;

  @IsString()
  @IsOptional()
  opportunityId?: string;
}
