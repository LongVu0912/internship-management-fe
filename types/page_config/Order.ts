class Order {
    sort: string;
    sortOrderType: "ASC" | "DESC";
    constructor(prop: string) {
        this.sort = prop;
        this.sortOrderType = "DESC";
    }
}

export { Order };
