export class AdminDto {
  id: string;
  parkId: string;
  name: string
  surname: string;
  phoneNumber: string
  email: string;

  constructor(data: any) {
    this.id = data.id;
    this.parkId = data.parkId;
    this.name = data.name;
    this.surname = data.surname;
    this.phoneNumber = data.phoneNumber;
    this.email = data.email;
  }
}
