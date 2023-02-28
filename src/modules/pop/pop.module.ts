import { Module } from "@nestjs/common";
import { ProductModule } from "./product/product.module";
import { CategoryModule } from "./category/category.module";
import { TaxModule } from "./tax/tax.module";
import { DiscountModule } from "./discount/discount.module";

@Module({
  imports: [
    ProductModule,
    CategoryModule,
    TaxModule,
    DiscountModule,
  ],
})
export class PopModule {}
