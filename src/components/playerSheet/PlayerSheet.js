import PlayerSheetBottomRight from './partitions/PlayerSheetBottomRight'
import PlayerSheetLeft from './partitions/PlayerSheetLeft'
import PlayerSheetTopRight from './partitions/PlayerSheetTopRight'
import './playerSheet.css'

export default function PlayerSheet() {
    return (
        <div className='page-Container'>
            <div className="player-Filled-Container" id="creationToken">
                <div className="player-Filled">
                    <PlayerSheetLeft></PlayerSheetLeft>
                    <div className="player-Filled-Right">
                        <PlayerSheetBottomRight></PlayerSheetBottomRight>
                        <PlayerSheetTopRight></PlayerSheetTopRight>
                    </div>
                </div>
            </div>
        </div>
    )
}