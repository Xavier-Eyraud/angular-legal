import { Component, OnInit } from '@angular/core';
import { Player } from '../player';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {
  players: Player[] = [];
  player : Player | undefined;
  
  constructor(
    private playerService: PlayerService) { }

  ngOnInit(): void {
    this.getPlayers();
  }

  getPlayers(): void {
    this.playerService.getPlayers(1)
    // .subscribe(players => [this.players = players['hydra:member'],this.total = players['hydra:view']['hydra:last']]);
    .subscribe(players => this.players = players);
  }

  updatePlayer(player:Player):void{
    this.playerService.updatePlayer(player)
    .subscribe();
  }

  deletePlayer(player:Player):void{
    this.players = this.players.filter(p => p !== player);
    this.playerService.deletePlayer(player.id).subscribe();
  }

  battle(players:Player[]):void{
    this.playerService.battle(players);
  }
  
}
