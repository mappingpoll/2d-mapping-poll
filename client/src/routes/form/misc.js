import { Text } from "preact-i18n";
import { DOT_MAX_RADIUS, DOT_MIN_RADIUS } from "./constants";

export function sizeRatio(size) {
  return 1 - size / 100;
}

export function sizeRatio2Radius(sizeRatio) {
  return DOT_MIN_RADIUS + sizeRatio * DOT_MAX_RADIUS;
}

export function size2Radius(size) {
  return sizeRatio2Radius(sizeRatio(size));
}

export function makeI18nLabels(i18nId, { top, bottom, left, right }) {
  return {
    top: <Text id={`${i18nId}.top`}>{top}</Text>,
    bottom: <Text id={`${i18nId}.bottom`}>{bottom}</Text>,
    left: <Text id={`${i18nId}.left`}>{left}</Text>,
    right: <Text id={`${i18nId}.right`}>{right}</Text>,
  };
}
