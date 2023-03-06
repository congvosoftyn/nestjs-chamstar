import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { ModifierModule } from './modifier/modifier.module';
import { ModifierOptionModule } from './modifier-option/modifier-option.module';
import { TaxModule } from './tax/tax.module';
import { DiscountModule } from './discount/discount.module';
import { ReceiptModule } from './receipt/receipt.module';
import { SaleModule } from './sale/sale.module';
import { RegisterModule } from './register/register.module';
import { GiftCardModule } from './gift-card/gift-card.module';
import { PosSettingModule } from './pos-setting/pos-setting.module';
import { ReportModule } from './report/report.module';
import { AnalyticService } from './analytic/analytic.service';
import { AnalyticController } from './analytic/analytic.controller';
import { AnalyticModule } from './analytic/analytic.module';

@Module({
  imports: [
    ProductModule,
    CategoryModule,
    // ModifierModule,
    // ModifierOptionModule,
    TaxModule,
    DiscountModule,
    // ReceiptModule,
    // SaleModule,
    // RegisterModule,
    // GiftCardModule,
    PosSettingModule,
    ReportModule,
    // AnalyticModule,
  ],
  providers: [AnalyticService],
  controllers: [AnalyticController],
})
export class PopModule { }
