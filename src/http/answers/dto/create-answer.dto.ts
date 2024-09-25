import { IsNotEmpty } from "class-validator";

export class CreateAnswerDto {

    @IsNotEmpty()
    quesntiosID?: string;

    @IsNotEmpty()
    answer?: string;
}
