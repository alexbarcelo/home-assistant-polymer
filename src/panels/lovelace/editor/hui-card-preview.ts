import "@polymer/paper-input/paper-textarea";

import createCardElement from "../common/create-card-element";
import createErrorCardConfig from "../common/create-error-card-config";
import { HomeAssistant } from "../../../types";
import { LovelaceCard, LovelaceConfig } from "../types";
import { ConfigError } from "./types";

const CUSTOM_TYPE_PREFIX = "custom:";

export class HuiCardPreview extends HTMLElement {
  private _hass?: HomeAssistant;
  private _element?: LovelaceCard;

  set hass(value: HomeAssistant) {
    this._hass = value;
    if (this._element) {
      this._element.hass = value;
    }
  }

  set error(error: ConfigError) {
    const configValue = createErrorCardConfig(
      `${error.type}: ${error.message}`,
      undefined
    );

    this._createCard(configValue);
  }

  set config(configValue: LovelaceConfig) {
    if (!configValue) {
      return;
    }

    if (!this._element) {
      this._createCard(configValue);
      return;
    }

    const tag = configValue.type.startsWith(CUSTOM_TYPE_PREFIX)
      ? configValue.type.substr(CUSTOM_TYPE_PREFIX.length)
      : `hui-${configValue.type}-card`;

    if (tag.toUpperCase() === this._element.tagName) {
      this._element.setConfig(configValue);
    } else {
      this._createCard(configValue);
    }
  }

  private _createCard(configValue: LovelaceConfig): void {
    if (this._element) {
      this.removeChild(this._element);
    }

    this._element = createCardElement(configValue);

    if (this._hass) {
      this._element!.hass = this._hass;
    }

    this.appendChild(this._element!);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-card-preview": HuiCardPreview;
  }
}

customElements.define("hui-card-preview", HuiCardPreview);
