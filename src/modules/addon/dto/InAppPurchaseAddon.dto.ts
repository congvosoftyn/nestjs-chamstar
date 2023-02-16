import { AddAddonToBillDto } from "./AddAddonToBill.dto";

export class InAppPurchaseAddonDto {
    addon: AddAddonToBillDto;
    iap: {
        receipt: string;
        price: number;
    };
}