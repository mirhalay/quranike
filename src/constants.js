const TYPE_ENUM = {
  meccan: 1,
  medinan: 2,
  any: 3,

  isNumValidType: (num) => num === 1 || num === 2 || num === 3,

  isKeySameWithVal: (typeStr,typeVal) => TYPE_ENUM[typeStr] === typeVal,
};

const SelectingEnum = {
  NO: 0,
  YES: 1,
  YES_NARROW: 2,

  switchSelecting: (i) =>
    i === SelectingEnum.NO ? SelectingEnum.YES : SelectingEnum.NO,

  switchOnly: (i) => (i ? SelectingEnum.YES_NARROW : SelectingEnum.YES),
};

export { TYPE_ENUM, SelectingEnum };
