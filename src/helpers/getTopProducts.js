const getTopProducts = (items) => {

    const grouped = items.reduce((acc, item) => {

        const key = `${item.product._id.toString()}|${item.presentation._id.toString()}`

        if (!acc[key]) {
            acc[key] = {
                product: item.product.name,
                presentation: item.presentation.type,
                totalQuantity: 0,
                totalSales: 0
            }
        }

        acc[key].totalQuantity += item.quantity;
        acc[key].totalSales += item.total;

        return acc

    }, {});

    const topProducts = Object.values(grouped).sort((a, b) => b.totalQuantity - a.totalQuantity);
    return topProducts.slice(0, 5);
}

module.exports = {
    getTopProducts
}