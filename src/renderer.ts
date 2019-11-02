import Element from './element'
import terminal from './terminal'

interface LayoutObject {
  width: number,
  height: number,
  absTop: number,
  absLeft: number,
  contentOffsetX: number,
  contentOffsetY: number
}

function getElementAbsolute(element: Element, property: string): number {
  if (property === 'top' || property === 'left') {
    if (element.parent) {
      return element[property] + getElementAbsolute(element.parent, property);
    } else {
      return element[property];
    }
  } else {
    throw new Error(`Can't get element absolute value on property ${property}.`);
  }
}

function calculateLayout(element: Element): LayoutObject {
  const width = element.width,
    height = element.height,
    absTop = getElementAbsolute(element, 'top'),
    absLeft = getElementAbsolute(element, 'left');

  let contentOffsetX = 0, contentOffsetY = 0;

  if (element._options && element._options.border) {
    contentOffsetX += 1;
    contentOffsetY += 1;
  }

  //todo style properties

  return {
    width,
    height,
    absTop,
    absLeft,
    contentOffsetX,
    contentOffsetY
  }
}

function calculateStyle(element: Element): any/*todo*/ {
  //border
  //background color
  //...

}

function paint(layout: LayoutObject): void {
  const {
    width,
    height,
    absTop,
    absLeft,
    contentOffsetX,
    contentOffsetY
  } = layout;

  terminal.clearArea(absLeft, absTop, width, height);
  terminal.cursorTo(absLeft, absTop);
}

export function layoutAndRender(element: Element) {
  const layout = calculateLayout(element);
  const style = calculateStyle(element);
  //const customPainters = element.constructor.customPainters;

  //paint(layout, style, element, customPainters);
}