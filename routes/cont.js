//get the nodes and check if the user has completed or if he is empty...
db.query('SELECT * FROM prestarter WHERE user = ?', [id], function(err, results, fields)
	if (err) throw err;
     //assign variables to nodes
    var level  = {
      	left: results[0].lft;
      	right: results[0].rgt;
       	user: results[0].user;
       	sponsor: results[0].sponsor;
    } 
	if (right === left + 1){
		//add two to all greater nodes. search for them all.
		db.query('SELECT * FROM prestarter WHERE rgt > ?', [level.left], function(err, results, fields)
		if (err) throw err;
		//loop with for
		for(var i = 0; i<results.length; i++);
		// create the variables
		var add1 = {
			left: results[i].length;
			right: results[i].length;
			user: results[i].length
			}
		//check if the left side is less than the level.left.
			if (add1.left > level.left){
				//add two to it
				add1.left += 2;
				//update in the database
				db.query('UPDATE starter SET lft = ? WHERE user = ?', [add1.left, add1.user], function(err, results,fields){
            		if (err) throw err;
					//increase the immediate right by one.
					level.right += 1;
					db.query('UPDATE starter SET rgt = ? WHERE user = ?', [level.right, level.user], function(err, results,fields){
                    	if (err) throw err;
						//insert the user in the matrix
						db.query('INSERT INTO prestarter (sponsor, user, lft, rgt) VALUES (?, ?)', [id, currentUser, left.level + 1, left.level + 2], function(error, results, fields){
                        	if (error) throw error;
						});
					});
				)};
			}
			//if the right is greater
			if(add1.right > level.left){
				//add two to it
				add1.right += 2;
				//update in the database
				db.query('UPDATE starter SET rgt = ? WHERE user = ?', [add1.right, add1.user], function(err, results,fields){
             	   if (err) throw err;
				});
			}
		)};
	}
)};