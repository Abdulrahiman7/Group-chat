const cron = require('node-cron');
const Chat=require('../models/chat');
const ArchivedChat=require('../models/archievedChat');
const moment = require('moment');

cron.schedule('0 0 * * *', async () => {

	  const oneDayAgo = moment().subtract(1, 'days').toDate();

	  const oldChats = await Chat.findAll({
		      where: {
			            createdAt: {
					            [Sequelize.Op.lt]: oneDayAgo,
					          },
			          },
		    });

	  await Promise.all(
		      oldChats.map(async (chat) => {
			            await ArchivedChat.create({
					            id: chat.id,
					            message: chat.message,
					            fileUrl: chat.fileUrl,
					            createdAt: chat.createdAt,
					          });

			            await chat.destroy(); 
			          })
		    );

	  console.log('Cron job executed successfully');
});

