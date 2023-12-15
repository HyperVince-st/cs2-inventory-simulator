/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CS_Item, CS_unlockCase } from "@ianlucas/cslib";
import { useState } from "react";
import { createPortal } from "react-dom";
import { ClientOnly } from "remix-utils/client-only";
import { useTimer } from "~/hooks/use-timer";
import {
  ApiActionUnlockCaseActionData,
  ApiActionUnlockCaseUrl
} from "~/routes/api.action.unlock-case._index";
import { postJson } from "~/utils/fetch";
import { range } from "~/utils/number";
import { playSound } from "~/utils/sound";
import { CaseOpeningCase } from "./case-opening-case";
import { CaseOpeningUnlocked } from "./case-opening-unlocked";
import { useRootContext } from "./root-context";

export function CaseOpening({
  caseIndex,
  caseItem,
  keyIndex,
  keyItem,
  onClose
}: {
  caseIndex: number;
  caseItem: CS_Item;
  keyIndex?: number;
  keyItem?: CS_Item;
  onClose(): void;
}) {
  const { user, inventory, setInventory } = useRootContext();
  const [items, setItems] = useState<ReturnType<typeof CS_unlockCase>[]>([]);
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [canUnlock, setCanUnlock] = useState(true);
  const [unlockedItem, setUnlockedItem] =
    useState<ReturnType<typeof CS_unlockCase>>();
  const [hideCaseContents, setHideCaseContents] = useState(false);
  const wait = useTimer();

  async function handleUnlock() {
    setIsDisplaying(false);
    setCanUnlock(false);
    const unlockedItem =
      user === undefined
        ? CS_unlockCase(caseItem)
        : await postJson<ApiActionUnlockCaseActionData>(
            ApiActionUnlockCaseUrl,
            { caseIndex, keyIndex }
          );
    wait(() => {
      setHideCaseContents(true);
      playSound("/open.mp3");
      wait(() => {
        setItems(
          range(32).map((_, index) =>
            index === 28 ? unlockedItem : CS_unlockCase(caseItem)
          )
        );
        setIsDisplaying(true);
        wait(() => {
          setUnlockedItem(unlockedItem);
          setInventory(inventory.unlockCase(unlockedItem, caseIndex, keyIndex));
        }, 6000);
      }, 100);
    }, 250);
  }

  return (
    <ClientOnly
      children={() =>
        createPortal(
          <div
            className={
              "fixed left-0 top-0 z-50 flex h-full w-full select-none items-center justify-center bg-black/60 backdrop-blur-sm"
            }
          >
            {unlockedItem ? (
              <CaseOpeningUnlocked
                caseItem={caseItem}
                onClose={onClose}
                unlockedItem={unlockedItem}
              />
            ) : (
              <CaseOpeningCase
                canUnlock={canUnlock}
                caseItem={caseItem}
                hideCaseContents={hideCaseContents}
                isDisplaying={isDisplaying}
                items={items}
                keyItem={keyItem}
                onClose={onClose}
                onUnlock={handleUnlock}
              />
            )}
          </div>,
          document.body
        )
      }
    />
  );
}
