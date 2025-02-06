/* eslint-disable @typescript-eslint/no-explicit-any */
import { BasePage } from './base.page';

import type { ICustomWorld } from '../support/custom-world';

import elements from '@/utils/testId.js';

let element: any;

export class TokensPage extends BasePage {
  constructor(world: ICustomWorld) {
    super(world);
  }
  get title() {
    return `${this.byTestId}${elements.pageTitle}`;
  }

  get copyBtn() {
    return "//td//*[@class='copy-button']";
  }

  async getRowByText(rowName: string) {
    element = `//*[text()='${rowName}'][1]`;
    return element;
  }

  async clickCopyBtnByRow(rowName: string) {
    const copyBtn = this.copyBtn;
    element = (await this.getRowByText(rowName)) + '/..//..//..//..' + copyBtn;

    await this.world.page?.locator(element).first().click();
  }
}
