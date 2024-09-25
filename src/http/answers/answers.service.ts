import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { InjectModel } from '@nestjs/mongoose'; 
import { Answer } from 'src/schemas/answers.schema';
import { Model } from 'mongoose';

@Injectable()
export class AnswersService {
  constructor(@InjectModel(Answer.name) private answerModel: Model<Answer>) {}

  async create(createAnswerDto: CreateAnswerDto) {
    const createdAnswer = new this.answerModel(createAnswerDto);
    return createdAnswer.save();
  }

   async findAll() {
    return this.answerModel.find().exec();
  }

  async findOne(id: string) {
    return this.answerModel.findById(id).exec();
  }

    async update(id: string, updateAnswerDto: UpdateAnswerDto) {
    return this.answerModel.findByIdAndUpdate(id, updateAnswerDto,{new: true}).exec();
  }

  async remove(id: string) {
    return this.answerModel.findByIdAndDelete(id).exec();
  }
}
