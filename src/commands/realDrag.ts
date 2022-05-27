import { fireCdpCommand } from "../fireCdpCommand";
import {
  getCypressElementCoordinates,
  Position,
  ScrollBehaviorOptions,
} from "../getCypressElementCoordinates";

export interface RealDragOptions {
  /**
   * Initial position for movement
   * @default "topLeft"
   * @example cy.realMouseMove({ position: "topRight" })
   */
  position?: Position;
  /**
   * Controls how the page is scrolled to bring the subject into view, if needed.
   * @example cy.realClick({ scrollBehavior: "top" });
   */
  scrollBehavior?: ScrollBehaviorOptions;
}

/** @ignore this, update documentation for this function at index.d.ts */
export async function realDrag(
  subject: JQuery,
  x: number ,
  y: number,
  options: RealDragOptions = {}
) {
  const basePosition= getCypressElementCoordinates(
    subject,
    "topLeft",
    options.scrollBehavior
  );
  const elem = subject.get(0).outerHTML;

  const log = Cypress.log({
    $el: subject,
    name: "realDrag",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Absolute Element Coordinates": basePosition,
    }),
  });

  log.snapshot("before");
  await fireCdpCommand("Input.dispatchDragEvent", {
            type: "dragOver",
            x: basePosition.x,
            y: basePosition.y,
            data: {items: [{mimeType: "text/html", data: elem}], dragOperationsMask: 16}
        });
  log.snapshot("after").end();

  return subject;
}
