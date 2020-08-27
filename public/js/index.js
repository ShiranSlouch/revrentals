$(function () {
    $('table.data-table').DataTable();

    // New rental
    $("[name='building_id']").on("change", function () {
        var buildingId = +this.value

        $("[name='apartment_id']").empty().append(_pageData.apartments.filter(function (a) {
            return a.building_id === buildingId
        }).map(function (a) {
            return $("<option>", {
                text: a.number,
                value: a.id
            })
        }))
    }).change()

    var $deviceInputs = $("[name='fobs'], [name='access_keys'], [name='remote_controllers']")
    $deviceInputs.on("input change", function () {
        $("[name='total_price']").val(
            $deviceInputs.map(function () {
                return this.value.trim().split("\n").map(function (c) {
                    return c.trim()
                }).filter(Boolean)
            }).toArray().length * 50
        )
    })


    // Default for input date
    function todayDate () {
        var local = new Date();
        local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
        return local.toJSON().slice(0,10);
    }

    $("input[type='date'].default-today").each(function () {
        if (!this.value) {
            $(this).val(todayDate())
        }
    })
    $(".select-two-element").select2()
})
