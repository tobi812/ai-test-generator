const removeEmptyValues = (list) => {
    for (let item of list) {
        if (!item) {
            list.splice(list.indexOf(item), 1);
        }
    }
    return list;
};
//# sourceMappingURL=test.js.map