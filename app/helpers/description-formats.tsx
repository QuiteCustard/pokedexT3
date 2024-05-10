import type { DescriptionFormats, TriggerFormats } from "@/types";

export const triggerFormats: TriggerFormats = {
    'level-up': 'Level up',
    'use-item': 'Use',
    'trade': 'Trade',
    'strong-style-move': 'Use a strong style move',
    'agile-style-move': 'Use an agile style move',
    'shed': 'Shed',
    'three-critical-hits': 'Land three critical hits',
    'take-damage': 'Take damage',
    'recoil-damage': 'Take recoil damage',
    'spin': 'Spin your character around',
    'other': 'Other method of evolution',
  };
  
export const descriptionFormats: DescriptionFormats = {
    'min_affection': 'with a minimum affection of',
    'min_beauty': 'with a minimum beauty of',
    'time_of_day': 'during the',
    'gender': 'being a',
    'held_item': 'while holding',
    'min_level': 'past level',
    'needs_overworld_rain': 'in the rain',
    'party_species': 'with',
    'trade_species': 'for',
    'location': 'at',
    'known_move': 'while knowing',
    'known_move_type': 'knowing a move of type',
};

export const keysToReplace = ['held_item', 'trade_species', 'location', 'known_move_type', 'known_move']