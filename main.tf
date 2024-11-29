provider "google" {
  project = "student-sandbox-project"
  region  = "europe-west1"
}

resource "google_sql_database_instance" "postgres_instance" {

  name             = "tf-instance-george"
  database_version = "POSTGRES_13"
  region           = var.region
  settings {
    tier = "db-f1-micro"
  }
}

resource "google_sql_database" "default" {
  name     = "defaultdb"
  instance = google_sql_database_instance.postgres_instance.name
}

resource "google_sql_user" "postgres" {
  name     = "postgres-george"
  instance = google_sql_database_instance.postgres_instance.name
  password = var.postgres_password
}

variable "region" {
  default = "europe-west1"
}

variable "postgres_password" {
  default = "12345"
}