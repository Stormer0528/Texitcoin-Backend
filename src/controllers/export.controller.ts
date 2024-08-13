import { Inject, Service } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import dayjs from 'dayjs';
import { ExcelService } from '@/service/excel';

@Service()
export class ExportController {
  constructor(
    @Inject(() => ExcelService)
    private readonly excelService: ExcelService
  ) {}
  async exportMembers(_req: Request, res: Response, _next: NextFunction) {
    res.attachment(`members-${dayjs().format('MMDDYYYY')}.xlsx`);
    res.send(await this.excelService.exportMembers());
  }
  async exportSales(_req: Request, res: Response, _next: NextFunction) {
    res.attachment(`sales-${dayjs().format('MMDDYYYY')}.xlsx`);
    res.send(await this.excelService.exportSales());
  }
  async exportRewards(_req: Request, res: Response, _next: NextFunction) {
    res.attachment(`rewards-${dayjs().format('MMDDYYYY')}.xlsx`);
    res.send(await this.excelService.exportRewards());
  }
}
