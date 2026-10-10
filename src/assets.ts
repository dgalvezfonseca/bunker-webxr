/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { AssetType, defineAssets } from '@iwsdk/core';
import { accessBadge, facilityBase } from './scene-assets/facility-base.scene-asset.js';

const publicAssetUrl = (filePath: string): string =>
  `${import.meta.env.BASE_URL}${filePath.replace(/^\/+/u, '')}`;
export default defineAssets({
  'facility-base': facilityBase,
  'guard-access': {
    url: publicAssetUrl('gltf/guard-access/guard-access.glb'),
    type: AssetType.GLTF,
    name: 'Guard booth and vehicle access',
    priority: 'critical',
  },
  'access-badge': accessBadge,
  'welcome-panel': {
    url: publicAssetUrl('ui/welcome.uikitml'),
    type: AssetType.UIKitML,
    name: 'Welcome Panel',
  },
  'station-panel': {
    url: publicAssetUrl('ui/station.uikitml'),
    type: AssetType.UIKitML,
    name: 'Information Station',
  },
});
