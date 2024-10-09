class Sort {
    unsorted: boolean;
    sorted: boolean;
    empty: boolean;

    constructor() {
        this.unsorted = true;
        this.sorted = false;
        this.empty = true;
    }
}

class PageConfig {
    totalPage: number;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    orders: any[];
    fullname: string;
    sort: Sort;
    filters: any[];

    constructor() {
        this.totalPage = 0;
        this.totalRecords = 0;
        this.currentPage = 1;
        this.pageSize = 6;
        this.orders = [];
        this.fullname = "";
        this.sort = new Sort();
        this.filters = [];
    }

    update(config: Partial<PageConfig>) {
        Object.assign(this, config);
    }
}

export { PageConfig };
