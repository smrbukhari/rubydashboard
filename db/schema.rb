# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170127071828) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "Tableau_test", id: false, force: :cascade do |t|
    t.date  "datetime"
    t.float "value"
  end

  create_table "snap_chat", id: false, force: :cascade do |t|
    t.integer "year"
    t.float   "snapchat_users"
    t.float   "percentage_users"
  end

  create_table "sysmon_tests", force: :cascade do |t|
    t.datetime "date_time"
    t.decimal  "cpu_util"
    t.decimal  "cpu_idle"
    t.string   "cpu_top"
    t.decimal  "mem_usage"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "test_tables", force: :cascade do |t|
    t.string   "cpu_top"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "date_time"
    t.decimal  "cpu_util"
    t.decimal  "cpu_idle"
    t.decimal  "mem_usage"
  end

  create_table "testmaps", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float    "latitude"
    t.float    "longitude"
    t.string   "applicant"
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
