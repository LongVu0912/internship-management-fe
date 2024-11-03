import type { Filter } from "./Filter";
import type { Order } from "./Order";
class PageConfig {
    totalPage: number;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    orders: Order[];
    filters: Filter[];

    constructor() {
        this.totalPage = 0;
        this.totalRecords = 0;
        this.currentPage = 1;
        this.pageSize = 6;
        this.orders = [];
        this.filters = [];
    }

    update(config: Partial<PageConfig>) {
        Object.assign(this, config);
    }
}

export { PageConfig };
