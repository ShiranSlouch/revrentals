const db = require("../db").get()

db("access_devices_history_log")
  .join("buildings", "buildings.id", "=", "access_devices_history_log.building_id")
  .join("apartments", "apartments.id", "=", "access_devices_history_log.apartment_id")
  .join("tenants", "tenants.id", "=", "access_devices_history_log.tenant_id")
  .where("access_devices_history_log.end_date", null)
  .select(
	"access_devices_history_log.id",
	"access_devices_history_log.access_levels",
	"access_devices_history_log.fobs",
	"access_devices_history_log.access_keys",
	"access_devices_history_log.remote_controllers",
	"access_devices_history_log.start_date",
	"access_devices_history_log.end_date",
	"access_devices_history_log.reasons",
	"access_devices_history_log.update_comments",
	"access_devices_history_log.building_id",
	"access_devices_history_log.apartment_id",
	"access_devices_history_log.tenant_id",
	"access_devices_history_log.total_price",
	"access_devices_history_log.reimbursement_date",
	"access_devices_history_log.check_number",
	"access_devices_history_log.created_at",
	"access_devices_history_log.updated_at",
	"buildings.address as building_address",
	"apartments.number as apartment_number",
	"tenants.full_name as tenant_full_name",
	"tenants.email as tenant_email",
	"tenants.phone_number as tenant_phone_number"
  ).then(rentals => {
    console.log(rentals)
  }).catch(console.error)
