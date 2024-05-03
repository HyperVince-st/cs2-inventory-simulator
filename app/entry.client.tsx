/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CS_Economy, CS_ITEMS } from "@ianlucas/cs2-lib";
import { RemixBrowser } from "@remix-run/react";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

CS_Economy.use({
  items: CS_ITEMS,
  translation: window.$itemsTranslation
});

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/javascript/service-worker.js");
}
