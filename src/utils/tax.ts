export const getCorrectTaxPercentAmount = (tax: string) => {
    if (tax === 'zw') return 0;
    if (tax === 'np') return 0;

    const toNumber = parseInt(tax);

    if (isNaN(toNumber)) throw new Error();

    return toNumber / 100;
}

export const getCorrectPriceWithTax = (price: number, taxValue: number) => {
    return Math.round(price * (1 + taxValue) * 100) / 100;
}