function DTColumnFilter( api ) {
    // noinspection JSUnresolvedReference
    const selectFilter = api.ajax.json().select_filter ?? [];
    const escapeRegex = DataTable.util.escapeRegex;

    api.columns('.select-filter').every( function () {
        const column = this;
        const headerNode = column.header();
        const title = headerNode.innerText;
        const titleAll   = title + ' (All)';
        const titleEmpty = title + ' (Empty)';

        // очищаем заголовок
        headerNode.innerHTML = '';

        // создаём select
        const select = document.createElement('select');
        select.className = 'form-select';
        select.style.width = '100%';
        select.style.padding = '0';
        select.style.height = '20px';
        select.innerHTML =
            `<option selected value="">${titleAll}</option>` +
            `<option value="##Empty##">${titleEmpty}</option>`;

        headerNode.appendChild(select);

        select.addEventListener('change', function () {
            const val = escapeRegex(this.value);

            if (val === '##Empty##') {
                column.search('^$', true, false).draw();
            } else {
                //column.search( val ? '^'+val+'$' : '', true, false ).draw();
                column.search( val ? '' + val + '' : '', true, false).draw();
            }
        });

        select.addEventListener('click', function (event) {
            event.stopPropagation();
        });

        const selectValues = (column.name() in selectFilter)
            ? selectFilter[column.name()]
            : column.data().unique().sort().toArray();

        selectValues.forEach((d) => {
            if (d === null || d === undefined) {
                return;
            }

            const val = escapeRegex(d);
            const option = document.createElement('option');
            option.value = d;
            option.textContent = d;

            // if (column.search() === "^" + val + "$") {
            if (column.search() === '' + val + '') {
                option.selected = true;
            }

            select.appendChild(option);
        });
    });
}

document.addEventListener('init.dt', function (e) {
    const table = e.target;
    const api = new DataTable.Api(table);

    // noinspection JSUnresolvedReference
    if (!api.init().DTColumnFilter || !DataTable.defaults.DTColumnFilter) {
        new DTColumnFilter(api);
    }
});
