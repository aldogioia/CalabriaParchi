import {ParkName} from '../model/enum/park-name';

export class FooterInfo {

  private static silaTitle= "Ente Parco Nazionale della Sila - Riserva della Biosfera MAB Sila";
  private static silaInfo = [
    "Via della Transumanza, 6  - 87100 Lorica - San Giovanni in Fiore (CS)",
    "Commissario Straordinario – Avv. Liborio Bloise",
    "Direttore - Arch. Ilario Treccosti",
    "Responsabile Unico del Progetto - geom. Mauro Procellini Iuele",
    "E-mail: protocollo@parcosila.it",
    "PEC: parcosila@pec.it",
    "P.IVA 02583110792"
  ];

  private static pollinoTitle= "Ente Parco Nazionale del Pollino";
  private static pollinoInfo = [
    "Complesso monumentale Santa Maria della Consolazione 85048 - Rotonda (PZ)",
    "Telefono: 0973 669311",
    "E-mail: ente@parconazionalepollino.it",
    "parcopollino@mailcertificata.biz"
  ];

  private static aspromonteTitle= "Ente Parco Nazionale dell'Aspromonte";
  private static aspromonteInfo = [
    "Via Aurora, 1 - Gambarie - 89057 Santo Stefano Aspromonte (RC)",
    "Telefono: 0965 743060",
    "E-mail: info.posta@parconazionaleaspromonte.it",
    "PEC: epna@pec.parconazionaleaspromonte.it",
    "P.IVA 02227330806"
  ];

  private static mariniTitle= "Ente Parchi Marini Calabria";
  private static mariniInfo = [
    "E-mail: protocollo@parchimarinicalabria.it",
    "PEC: protocollo@pec.parchimarinicalabria.it",
    "Codice Univoco fatturazione elettronica: UFJ74V",
    "Codice Fiscale: 97094420797"
  ];

  private static serreTitle= "Ente Parco Naturale Regionale delle Serre";
  private static serreInfo = [];

  private static cratiTitle= "Riserve Naturali Regionali Lago di Tarsia - Foce del Crati";
  private static cratiInfo = [
    "Telefono: 0981 952185",
    "E-mail: info@riservetarsiacrati.it",
    "PEC: info@pec.riservetarsiacrati.it"
  ];

  static getTitle(parkName: string): string {
    switch (this.getParkName(parkName)) {
      case ParkName.SILA:
        return this.silaTitle;
      case ParkName.ASPROMONTE:
        return this.aspromonteTitle;
      case ParkName.POLLINO:
        return this.pollinoTitle;
      case ParkName.MARINI:
        return this.mariniTitle;
      case ParkName.SERRE:
        return this.serreTitle;
      case ParkName.CRATI:
        return this.cratiTitle;
      default:
        return "";
    }
  }

  static getInfo(parkName: string): string[] {
    const park = this.getParkName(parkName);
    switch (park) {
      case ParkName.SILA:
        return this.silaInfo;
      case ParkName.ASPROMONTE:
        return this.aspromonteInfo;
      case ParkName.POLLINO:
        return this.pollinoInfo;
      case ParkName.MARINI:
        return this.mariniInfo;
      case ParkName.SERRE:
        return this.serreInfo;
      case ParkName.CRATI:
        return this.cratiInfo;
      default:
        return [""];
    }
  }

  private static getParkName(parkName: string) {
    if (parkName.includes("Sila"))
      return ParkName.SILA;
    else if (parkName.includes("Aspromonte"))
      return ParkName.ASPROMONTE;
    else if (parkName.includes("Pollino"))
      return ParkName.POLLINO;
    else if (parkName.includes("Serre"))
      return ParkName.SERRE;
    else if (parkName.includes("Crati"))
      return ParkName.CRATI;
    else if (parkName.includes("Marini"))
      return ParkName.MARINI;
    else
      return ParkName.SILA;
  }

}
