data "http" "icanhazip" {
  url = "http://icanhazip.com"
}

locals {
  my-ip = chomp(data.http.icanhazip.body)
}
