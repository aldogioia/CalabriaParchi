export abstract class ExperiencePostAbstract {
  name: string;
  surname: string;
  description: string;
  email: string;

  protected constructor(data: any) {
    this.name = data.name;
    this.surname = data.surname;
    this.description = data.description;
    this.email = data.email;
  }
}
