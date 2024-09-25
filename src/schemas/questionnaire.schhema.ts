import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import e from 'express';
import {Document} from 'mongoose';
@Schema()
export class Questionnaire extends Document {
  @Prop({required: true})
  titile?: string;

  @Prop({required: true})
  description?: string;
}
export const QuestionnaireSchema = SchemaFactory.createForClass(Questionnaire);