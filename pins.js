db.query('INSERT INTO starter_tree (sponsor, user) VALUES (?, ?)', [id, currentUser], function(error, results, fields){
  if (error) throw error;
  // change the user to a paid member
  db.query('UPDATE user SET paid = ? WHERE user_id = ?', ["yes", currentUser], function(err, results,fields){
    if (err) throw err;
    console.log(results);
    //check if his sponsor has direct referrals
    db.query('SELECT user_id FROM user WHERE sponsor = ?', [sponsor], function(err, results, fields){
      if (err) throw err;
      console.log(results);
      //if the sponsor has referrals
      if (results.length > 0){
        //select from the sponsor to get his empty field
        db.query('SELECT * FROM starter_tree WHERE user = ?', [id], function(err, results, fields){
          if (err) throw err;
          var spon = results[0].sponsor;
          console.log(results);
          //code if sponsor is not a paid member
          if (results.length === 0){
            //select from his sponsor
            db.query('SELECT paid FROM user WHERE user_id = ?', [spon], function(err, results, fields){
              if (err) throw err;
              var paid=results[0].paid;
              //if sponsor is paid
              if(paid==="yes"){
                //select his empty field
                db.query('SELECT * FROM starter_tree WHERE user = ?', [spon], function(err, results, fields){
                  if (err) throw err;
                  if(results.length===1 && results[0].a === null){
                    //start filling up field
                    db.query('UPDATE starter_tree SET a = ? WHERE user = ?', [currentUser, spon], function(err, results,fields){
                      if (err) throw err;
                      res.render('join', {title:'MATRIX ENTRANCE SUCCESSFUL'});
                    });
                  }if (results.length===1 && results[0].a !==null && results[0].b === null && results[0].c === null){
                     //start filling up field
                    db.query('UPDATE starter_tree SET b = ? WHERE user = ?', [currentUser, spon], function(err, results,fields){
                      if (err) throw err;
                      res.render('join', {title:'MATRIX ENTRANCE SUCCESSFUL'});
                    });
                  }if (results.length===1 && results[0].a !==null && results[0].b !== null && results[0].c === null){
                    //start filling up field
                    db.query('UPDATE starter_tree SET c = ? WHERE user = ?', [currentUser, spon], function(err, results,fields){
                      if (err) throw err;
                      res.render('join', {title:'MATRIX ENTRANCE SUCCESSFUL'});
                    });
                  }if (results.length===1 && results[0].a !== null && results[0].b !== null && results[0].c !== null){
                    db.query('SELECT user FROM starter_tree WHERE sponsor = ? and a = ?', [spon, null], function(err, results, fields){
                      if (err) throw err;
                      console.log(results);
                      var field= {
                        a: results[0].a,
                        b: results[0].b,
                        c: results[0].c,
                        aa: results[0].aa,
                        ab: results[0].ab,
                        ac: results[0].ac,
                        ba: results[0].ba,
                        bb: results[0].bb,
                        bc: results[0].bc,
                        ca: results[0].ca,
                        cb: results[0].cb,
                        cc: results[0].cc,
                        aaa: results[0].aaa,
                        aab: results[0].aab,
                        aac: results[0].aac,
                        aba: results[0].aba,
                        abb: results[0].abb,
                        abc: results[0].abc,
                        aca: results[0].aca,
                        acb: results[0].acb,
                        acc: results[0].acc,
                        baa: results[0].baa,
                        bab: results[0].bab,
                        bac: results[0].bac,
                        bba: results[0].bba,
                        bbc: results[0].bbc,
                        bca: results[0].bca,
                        bcb: results[0].bcb,
                        bcc: results[0].bcc,
                        caa: results[0].caa,
                        cab: results[0].cab,
                        cac: results[0].cac,
                        cba: results[0].cba,
                        cbb: results[0].cbb,
                        cbc: results[0].cbc,
                        cca: results[0].cca,
                        ccb: results[0].ccb,
                        ccc: results[0].ccc
                      } 
                      if(field.aa === null && field.ab === null && field.ac === null && field.ba === null && field.bb === null && field.bc === null && field.ca === null && field.cb === null && field.cc === null){
                        db.query('UPDATE starter_tree SET aa = ? WHERE user = ?', [currentUser, spon], function(err, results,fields){
                          if (err) throw err;
                          res.render('join', {title:'MATRIX ENTRANCE SUCCESSFUL'});
                        });
                      }if(field.aa !== null && field.ab === null && field.ac === null && field.ba === null && field.bb === null && field.bc === null && field.ca === null && field.cb === null && field.cc === null){
                        db.query('UPDATE starter_tree SET ba = ? WHERE user = ?', [currentUser, spon], function(err, results,fields){
                          if (err) throw err;
                          res.render('join', {title:'MATRIX ENTRANCE SUCCESSFUL'});
                        });
                      }if(field.aa !== null && field.ab === null && field.ac === null && field.ba !== null && field.bb === null && field.bc === null && field.ca === null && field.cb === null && field.cc === null){
                        db.query('UPDATE starter_tree SET ca = ? WHERE user = ?', [currentUser, spon], function(err, results,fields){
                          if (err) throw err;
                          res.render('join', {title:'MATRIX ENTRANCE SUCCESSFUL'});
                        });
                      }if(field.aa !== null && field.ab === null && field.ac === null && field.ba !== null && field.bb === null && field.bc === null && field.ca !== null && field.cb === null && field.cc === null){
                        db.query('UPDATE starter_tree SET ab = ? WHERE user = ?', [currentUser, spon], function(err, results,fields){
                          if (err) throw err;
                          res.render('join', {title:'MATRIX ENTRANCE SUCCESSFUL'});
                        });
                      }if(field.aa !== null && field.ab !== null && field.ac === null && field.ba !== null && field.bb === null && field.bc === null && field.ca !== null && field.cb === null && field.cc === null){
                        db.query('UPDATE starter_tree SET bb = ? WHERE user = ?', [currentUser, spon], function(err, results,fields){
                          if (err) throw err;
                          res.render('join', {title:'MATRIX ENTRANCE SUCCESSFUL'});
                        });
                      }if(field.aa !== null && field.ab !== null && field.ac === null && field.ba !== null && field.bb !== null && field.bc === null && field.ca !== null && field.cb === null && field.cc === null){
                        db.query('UPDATE starter_tree SET cb = ? WHERE user = ?', [currentUser, spon], function(err, results,fields){
                          if (err) throw err;
                          res.render('join', {title:'MATRIX ENTRANCE SUCCESSFUL'});
                        });
                      }if(field.aa !== null && field.ab !== null && field.ac === null && field.ba !== null && field.bb !== null && field.bc === null && field.ca !== null && field.cb !== null && field.cc === null){
                        db.query('UPDATE starter_tree SET ac = ? WHERE user = ?', [currentUser, spon], function(err, results,fields){
                          if (err) throw err;
                          res.render('join', {title:'MATRIX ENTRANCE SUCCESSFUL'});
                        });
                      }if(field.aa !== null && field.ab !== null && field.ac !== null && field.ba !== null && field.bb !== null && field.bc === null && field.ca !== null && field.cb !== null && field.cc === null){
                        db.query('UPDATE starter_tree SET bc = ? WHERE user = ?', [currentUser, spon], function(err, results,fields){
                          if (err) throw err;
                          res.render('join', {title:'MATRIX ENTRANCE SUCCESSFUL'});
                        });
                      }if(field.aa !== null && field.ab !== null && field.ac !== null && field.ba !== null && field.bb !== null && field.bc !== null && field.ca !== null && field.cb !== null && field.cc === null){
                        db.query('UPDATE starter_tree SET cc = ? WHERE user = ?', [currentUser, spon], function(err, results,fields){
                          if (err) throw err;
                          res.render('join', {title:'MATRIX ENTRANCE SUCCESSFUL'});
                        });
                      }if(field.aaa === null && field.aab === null && field.aac === null && field.aba=== null && field.abb === null && field.abc === null && field.aca === null && field.acb === null && field.acc === null && field.baa === null && field.bab === null && field.bac ===null && field.bba === null && field.bbb === null && field.bbc && field.bca === null && field.bcb === null && field.bcc === null && field.caa === null && field.cab === null && field.cac === null && field.cba === null && field.cbb === null &&field.cbc === null && field.cca === null && field.ccc === null){
                        db.query('UPDATE starter_tree SET aaa =?', [currentUser, spon], function(err, results, fields){
                          if (err) throw err;
                          res.render('join', {title: 'MATRIX ENTRANCE SUCCESSFUL!'})
                        });
                      }if(field.aaa !== null && field.aab === null && field.aac === null && field.aba=== null && field.abb === null && field.abc === null && field.aca === null && field.acb === null && field.acc === null && field.baa === null && field.bab === null && field.bac ===null && field.bba === null && field.bbb === null && field.bbc && field.bca === null && field.bcb === null && field.bcc === null && field.caa === null && field.cab === null && field.cac === null && field.cba === null && field.cbb === null &&field.cbc === null && field.cca === null && field.ccc === null){
                        db.query('UPDATE starter_tree SET aba =?', [currentUser, spon], function(err, results, fields){
                          if (err) throw err;
                          res.render('join', {title: 'MATRIX ENTRANCE SUCCESSFUL!'})
                        });
                      }if(field.aaa !== null && field.aab === null && field.aac === null && field.aba !== null && field.abb === null && field.abc === null && field.aca === null && field.acb === null && field.acc === null && field.baa === null && field.bab === null && field.bac ===null && field.bba === null && field.bbb === null && field.bbc && field.bca === null && field.bcb === null && field.bcc === null && field.caa === null && field.cab === null && field.cac === null && field.cba === null && field.cbb === null &&field.cbc === null && field.cca === null && field.ccc === null){
                        db.query('UPDATE starter_tree SET aca =?', [currentUser, spon], function(err, results, fields){
                          if (err) throw err;
                          res.render('join', {title: 'MATRIX ENTRANCE SUCCESSFUL!'})
                        });
                      }if(field.aaa !== null && field.aab === null && field.aac === null && field.aba!==null && field.abb === null && field.abc === null && field.acb === null && field.acc === null && field.baa === null && field.bab === null && field.bac ===null && field.bba === null && field.bbb === null && field.bbc && field.bca === null && field.bcb === null && field.bcc === null && field.caa === null && field.cab === null && field.cac === null && field.cba === null && field.cbb === null &&field.cbc === null && field.cca === null && field.ccc === null){
                        db.query('UPDATE starter_tree SET baa =?', [currentUser, spon], function(err, results, fields){
                          if (err) throw err;
                          res.render('join', {title: 'MATRIX ENTRANCE SUCCESSFUL!'})
                        });
                      }if(field.bba === null && field.aac === null && field.abb === null && field.abc === null && field.acb === null && field.acc === null && field.bab === null && field.bac ===null && field.bba === null && field.bbb === null && field.bbc && field.bca === null && field.bcb === null && field.bcc === null && field.caa === null && field.cab === null && field.cac === null && field.cba === null && field.cbb === null &&field.cbc === null && field.cca === null && field.ccc === null){
                        db.query('UPDATE starter_tree SET bba =?', [currentUser, spon], function(err, results, fields){
                          if (err) throw err;
                          res.render('join', {title: 'MATRIX ENTRANCE SUCCESSFUL!'})
                        });
                      }if(field.aac === null && field.abb === null && field.abc === null && field.acb === null && field.acc === null && field.bab === null && field.bac ===null && field.bbb === null && field.bbc && field.bca === null && field.bcb === null && field.bcc === null && field.caa === null && field.cab === null && field.cac === null && field.cba === null && field.cbb === null &&field.cbc === null && field.cca === null && field.ccc === null){
                        db.query('UPDATE starter_tree SET bca =?', [currentUser, spon], function(err, results, fields){
                          if (err) throw err;
                          res.render('join', {title: 'MATRIX ENTRANCE SUCCESSFUL!'})
                        });
                      }if(field.aac === null && field.abb === null && field.abc === null && field.acb === null && field.acc === null && field.bab === null && field.bac ===null && field.bbb === null && field.bbc && field.bcb === null && field.bcc === null && field.caa === null && field.cab === null && field.cac === null && field.cba === null && field.cbb === null &&field.cbc === null && field.cca === null && field.ccc === null){
                        db.query('UPDATE starter_tree SET caa =?', [currentUser, spon], function(err, results, fields){
                          if (err) throw err;
                          res.render('join', {title: 'MATRIX ENTRANCE SUCCESSFUL!'})
                        });
                      }if(field.aac === null && field.abb === null && field.abc === null && field.acb === null && field.acc === null && field.bab === null && field.bac ===null && field.bbb === null && field.bbc && field.bcb === null && field.bcc === null && field.cab === null && field.cac === null && field.cba === null && field.cbb === null &&field.cbc === null && field.cca === null && field.ccc === null){
                        db.query('UPDATE starter_tree SET cba =?', [currentUser, spon], function(err, results, fields){
                          if (err) throw err;
                          res.render('join', {title: 'MATRIX ENTRANCE SUCCESSFUL!'})
                        });
                      }if(field.aac === null && field.abb === null && field.abc === null && field.acb === null && field.acc === null && field.bab === null && field.bac ===null && field.bbb === null && field.bbc && field.bcb === null && field.bcc === null && field.cab === null && field.cac === null && field.cbb === null &&field.cbc === null && field.cca === null && field.ccc === null){
                        db.query('UPDATE starter_tree SET cba = ?', [currentUser, spon], function(err, results, fields){
                          if (err) throw err;
                          res.render('join', {title: 'MATRIX ENTRANCE SUCCESSFUL!'});
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  });
});