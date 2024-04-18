/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CS_Economy, CS_Item } from "@ianlucas/cs2-lib";
import { useNameItemString } from "~/components/hooks/use-name-item";
import { useTranslate } from "./app-context";

export function InventoryItemContents({ item }: { item: CS_Item }) {
  const translate = useTranslate();
  const nameItemString = useNameItemString();

  return (
    <div className="mt-4">
      <div className="text-neutral-400">
        {translate("InventoryItemContainsOne")}
      </div>
      {CS_Economy.listCaseContents(item, true).map((item) => (
        <div key={item.id} style={{ color: item.rarity }}>
          {nameItemString(item, "case-contents-name")}
        </div>
      ))}
      {item.specials !== undefined && (
        <div className="text-yellow-300">
          {translate("InventoryItemRareItem")}
        </div>
      )}
    </div>
  );
}
