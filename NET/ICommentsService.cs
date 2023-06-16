using Sabio.Models.Domain;
using Sabio.Models.Requests;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface ICommentsService
    {
        List<Comment> GetByEntityTypeId(int entityId, int entityTypeId);
        void DeleteComments(int id);
        int AddComments(CommentsAddRequest model, int userId);
        void UpdateComments(CommentsUpdateRequest model);
        Comment MapSingleComment(IDataReader reader, ref int startingIndex);
    }
}
