import React from 'react';
import type { Player } from '../types';
import { SpeechBubble } from './avatars';

interface MeetingRoomProps {
  players: Player[];
}

// Pre-calculated positions for up to 6 players
const positions: { [key: number]: string[] } = {
  2: ['top-0 left-1/4 -translate-x-1/2', 'bottom-0 left-3/4 -translate-x-1/2'],
  3: ['top-0 left-1/2 -translate-x-1/2', 'bottom-0 left-1/4 translate-x-[-25%]', 'bottom-0 right-1/4 translate-x-[25%]'],
  4: ['top-0 left-1/4 -translate-x-1/2', 'top-0 right-1/4 translate-x-1/2', 'bottom-0 left-1/4 -translate-x-1/2', 'bottom-0 right-1/4 translate-x-1/2'],
  5: ['top-0 left-1/3 -translate-x-1/2', 'top-0 right-1/3 translate-x-1/2', 'bottom-0 left-1/4 translate-x-[-25%]', 'bottom-0 left-1/2 -translate-x-1/2', 'bottom-0 right-1/4 translate-x-[25%]'],
  6: ['top-0 left-1/4 -translate-x-1/2', 'top-0 left-1/2 -translate-x-1/2', 'top-0 right-1/4 translate-x-1/2', 'bottom-0 left-1/4 -translate-x-1/2', 'bottom-0 left-1/2 -translate-x-1/2', 'bottom-0 right-1/4 translate-x-1/2'],
};

const MeetingRoom: React.FC<MeetingRoomProps> = ({ players }) => {
  const playerPositions = positions[players.length] || [];

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <h3 className="text-lg font-bold mb-4 text-slate-200">Sala de Crisis</h3>
        <div className="relative w-full h-80 flex items-center justify-center">
            {/* Table */}
            <div className="absolute w-2/3 h-1/2 bg-slate-700/80 rounded-[50%] shadow-2xl border-2 border-slate-600"></div>

            {/* Players */}
            {players.map((player, index) => {
                const { AvatarComponent, isStanding, speech } = player;
                const positionClass = playerPositions[index] || '';
                
                return (
                    <div key={player.id} className={`absolute transform ${positionClass}`}>
                        <div className="relative flex flex-col items-center">
                            <AvatarComponent isStanding={isStanding} />
                            <div className="mt-1 bg-slate-900/70 px-2 py-1 rounded-md text-center">
                                <p className="text-xs font-bold text-slate-200 truncate max-w-24">{player.role.title.split('(')[0].trim()}</p>
                                <p className="text-xs text-amber-400">{player.firstName || player.name}</p>
                            </div>
                            {speech && <SpeechBubble text={speech} />}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default MeetingRoom;