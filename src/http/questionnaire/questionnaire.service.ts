import { Injectable } from '@nestjs/common';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import { Questionnaire } from '../../schemas/questionnaire.schhema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class QuestionnaireService {
  constructor(@InjectModel(Questionnaire.name) private questionnaireModel: Model<Questionnaire>) {}

  async create(createQuestionnaireDto: CreateQuestionnaireDto) {
    const createdQuestionnaire = new this.questionnaireModel(createQuestionnaireDto);
    return createdQuestionnaire.save();
  }

  async findAll() {
    return this.questionnaireModel.find().exec();
  }

  async findOne(id: string) {
    return this.questionnaireModel.findById(id).exec();
  }

  async update(id: string, updateQuestionnaireDto: UpdateQuestionnaireDto) {
    return this.questionnaireModel.findByIdAndUpdate(id, updateQuestionnaireDto).exec();
  }

  async remove(id: string) {
    return this.questionnaireModel.findByIdAndDelete(id).exec();
  }
}
