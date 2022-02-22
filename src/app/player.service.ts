import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Player } from './player';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class PlayerService {

  private playersUrl = 'http://localhost:8000/api/players';  // URL to web api
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
    
  getPlayers(page:number):Observable<Player[]>{
    const url = this.playersUrl+'.json?page='+page;
    return this.http.get<Player[]>(url)
    .pipe(
      catchError(
        this.handleError<Player[]>('Impossible d\'afficher la liste des joueurs', [])
      )
    )
  }
  
  // addPlayer(player: Player): Observable<Player> {
  //   return this.http.post<Player>(this.playersUrl, player, this.httpOptions).pipe(
  //     tap((newPlayer: Player) => this.log(`Le joueur a bien été créé w/ id=${newPlayer.id}`)),
  //     catchError(this.handleError<Player>('Impossible d'ajouter cet utilisateur'))
  //   );
  // }

  updatePlayer(player: Player): Observable<Player> {
    const url = this.playersUrl+'/'+player.id;
    return this.http.put<Player>(url, player ,this.httpOptions).pipe(
      tap(_ => this.log('La mise à jour s\'est déroulée avec succès')),
      catchError(this.handleError<Player>('Impossible de modifier le joueur'))
    );        
  }

  deletePlayer(id: number): Observable<Player> {
    const url = `${this.playersUrl}/${id}`;
    return this.http.delete<Player>(url, this.httpOptions).pipe(
      tap(_ => this.log('Le joueur a bien été supprimé')),
      catchError(this.handleError<Player>('Impossible de supprimer le joueur'))
    );
  }

  battle(players:Player[]){
    //random number
    let randPlayer1=Math.floor(Math.random() * players.length);
    let randPlayer2=randPlayer1;
    while(randPlayer1==randPlayer2){
      randPlayer2=Math.floor(Math.random() * players.length);
    }
    //players on top
    players.unshift(players[randPlayer2]);
    players.splice(randPlayer2+1,1);
    players.unshift(players[randPlayer1]);
    players.splice(randPlayer1+1,1);

    //save the defense value
    var defP1=players[0]['defense'];
    var defP2=players[1]['defense'];
    
    //message
    let message = "Un combat entre " + players[0]['name'] + " et " + players[1]['name'] + " a commencé.\r\n"
    this.messageService.add(message);

    //battle
    let battle=setInterval(() => {
      players[1]['defense']-=players[0]['attack'];
      if(players[1]['defense']<=0){
        message=players[0]['name']+ " a gagné";
        clearInterval(battle);
      }
      else{
        players[0]['defense']-=players[1]['attack'];
        if(players[0]['defense']<=0){
          message=players[1]['name']+ " a gagné";
          clearInterval(battle);
        }
      }
      //retrieve original defense
      setTimeout(()=>{
        players[1]['defense']=defP2;
        players[0]['defense']=defP1;
      },2000);
      this.messageService.add(message);
    }, 1000);
  }
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(operation + " (" + error.message +")");
      return of(result as T);
    };
  }

  /** MessageService */
  private log(message: string) {
    this.messageService.add(`${message}`);
  }
}