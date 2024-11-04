import {Cardinality} from "../../lib/domain/relationship.ts";

export const getCardinalityMarkerId = ({
                                         cardinality,
                                         selected,
                                         side,
                                       }: {
  cardinality: Cardinality;
  selected: boolean;
  side: 'left' | 'right';
}) =>
  `cardinality_${selected ? 'selected' : 'not_selected'}_${cardinality}_${side}`;

