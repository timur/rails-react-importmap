// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails";
import "controllers";
import * as ActiveStorage from "@rails/activestorage";
import "alpine-turbo-drive-adapter";
import Alpine from "alpinejs";
import "components";

ActiveStorage.start();
window.Alpine = Alpine;
Alpine.start();
