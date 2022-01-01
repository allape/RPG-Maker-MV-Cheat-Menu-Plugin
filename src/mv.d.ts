export {}

declare global {
  const nw: any

  const $gameActors: Game_Actors

  class Game_Skill {

  }

  class Game_Actor {
    _name: string

    // max hp
    mhp: number
    // max mp
    mmp: number

    maxTp: () => number

    gainHp: (hp: number) => void;
    setHp: (hp: number) => void;
    gainMp: (mp: number) => void;
    setMp: (mp: number) => void;
    gainTp: (tp: number) => void;
    setTp: (tp: number) => void;
    paySkillCost: (skill: Game_Skill) => void;
  }

  class Game_Actors {
    _data: Game_Actor[]
  }

  class SoundManager {
    static playSystemSound(soundIndex?: number): void
  }
}

