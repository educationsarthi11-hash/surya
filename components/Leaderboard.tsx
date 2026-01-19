import React from 'react';
import { TrophyIcon } from './icons/AllIcons';
import { gamificationService } from '../services/gamificationService';
import { User } from '../types';

interface LeaderboardProps {
    user: User;
}

const rankColors: { [key: number]: string } = {
    1: 'bg-amber-400 text-amber-900 border-amber-500',
    2: 'bg-slate-300 text-slate-800 border-slate-400',
    3: 'bg-yellow-600 text-white border-yellow-700',
};

const MemoizedLeaderboardRow: React.FC<{ player: any; isCurrentUser: boolean; }> = React.memo(({ player, isCurrentUser }) => {
    return (
        <div className={`flex items-center p-3 rounded-lg border-2 ${isCurrentUser ? 'bg-primary/10 border-primary shadow-md' : 'bg-white border-transparent'}`}>
            <div className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-lg border-2 ${rankColors[player.rank] || 'bg-neutral-200 text-neutral-700 border-neutral-300'}`}>
                {player.rank}
            </div>
            <div className="ml-4 flex-grow">
                <p className="font-bold text-neutral-800">{player.name} {isCurrentUser && '(You)'}</p>
                <p className="text-xs text-neutral-500">{player.levelName}</p>
            </div>
            <div className="text-right">
                <p className="font-bold text-primary">{player.points.toLocaleString()} pts</p>
            </div>
        </div>
    );
});


const Leaderboard: React.FC<LeaderboardProps> = ({ user }) => {
    const leaderboardData = gamificationService.getLeaderboard();

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft">
            <div className="flex items-center mb-6">
                <TrophyIcon className="h-8 w-8 text-amber-500"/>
                <h2 className="ml-3 text-2xl font-bold text-neutral-900">Leaderboard</h2>
            </div>
            <p className="text-sm text-neutral-600 mb-6">See where you stand among your peers. Keep learning to climb the ranks!</p>

            <div className="space-y-3">
                {leaderboardData.map((player) => (
                   <MemoizedLeaderboardRow 
                        key={player.studentId}
                        player={player}
                        isCurrentUser={player.studentId === user.id}
                   />
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;