class Filter {
    prop: string;
    value: string;
    type: string;
    operator: string;

    constructor(prop: string) {
        this.prop = prop;
        this.value = "";
        this.type = "TEXT";
        this.operator = "CONTAINS";
    }
}

export { Filter };
